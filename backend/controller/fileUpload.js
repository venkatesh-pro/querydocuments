const User = require("../model/auth");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const pdfParse = require("pdf-parse");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("langchain/vectorstores");
const { OpenAIEmbeddings } = require("langchain/embeddings");
const FileUpload = require("../model/fileUpload");
const FileQuery = require("../model/fileQuery");
const { RetrievalQAChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms");

// pinecone
let pineconeClient;
let pineconeIndex;
const pineconeDb = async () => {
  try {
    pineconeClient = new PineconeClient();
    await pineconeClient.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX);

    console.log("Connected to Pinecone");
  } catch (error) {
    console.log(error);
    // we need to send email to admin, if error occur
  }
};

pineconeDb();

const awsConfig = {
  apiVersion: process.env.AWS_API_VERSION,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
};

const s3 = new AWS.S3(awsConfig);

const processStoring = async (res, file, text, userId) => {
  // split the text
  try {
    const fileName = file.name;
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];

    const params = {
      Bucket: "documentsuploads3",
      Key: `${uuidv4()}.${extension}`,
      Body: file.data,
      ACL: "public-read",
      ContentEncoding: "7bit",
      ContentType: file.mimetype,
    };
    const data = await s3
      .upload(params)
      .on("httpUploadProgress", (progress) => {
        console.log("S3 Upload Progress:", progress);
      })
      .promise();

    console.log(data.Location);

    if (data.Location) {
      const fileUploadRes = await FileUpload.create({
        fileName: fileName,
        fileUrl: data.Location,
        userId: userId,
      });
      const user = {
        userId: userId,
        fileId: fileUploadRes._id.toString(),
      };
      const text_splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await text_splitter.createDocuments([text], [user]);
      console.log("chunk");
      await PineconeStore.fromDocuments(
        chunks,
        new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        }),
        {
          pineconeIndex,
        }
      );

      return res.json(fileUploadRes._id);
    } else {
      return res.status(400).json({
        error: "File Upload Failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Please Try Again Your File Not Processed Properly",
    });
  }
};
const processPdf = async (file) => {
  const data = await pdfParse(file);
  return data.text;
};
const processOtherDocs = async (file) => {};

exports.uploadFile = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email }).select("_id");
    console.log(user);

    const file = req.files.file;

    if (file.mimetype === "application/pdf") {
      const text = await processPdf(file);
      return await processStoring(res, file, text, user._id.toString());
    } else if (
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const text = await processOtherDocs(file);

      return res.json(text);
    }

    res.json("'dddd'");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "No User Found",
    });
  }
};

// query pinecone

exports.sendMessage = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email }).select("_id");
    console.log(user);

    await FileQuery.create({
      userId: user._id,
      fileId: req.body.fileId,
      message: req.body.message,
      isHuman: true,
    });

    // query the pinecone
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
        filter: {
          userId: user._id.toString(),
          fileId: req.body.fileId,
        },
      }
    );
    const model = new OpenAI({ modelName: "gpt-3.5-turbo" });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(1), {
      returnSourceDocuments: true,
    });
    const response = await chain.call({
      query: req.body.message,
    });

    console.log(response);

    const createdAI = await FileQuery.create({
      userId: user._id,
      fileId: req.body.fileId,
      message: response.text,
      isHuman: false,
    });
    res.json(createdAI);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Fetch Failed",
    });
  }
};
