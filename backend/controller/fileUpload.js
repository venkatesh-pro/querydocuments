const User = require("../model/auth");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const pdfParse = require("pdf-parse");
const textract = require("textract");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("langchain/vectorstores");
const { OpenAIEmbeddings } = require("langchain/embeddings");
const FileUpload = require("../model/fileUpload");
const FileQuery = require("../model/fileQuery");
const {
  RetrievalQAChain,
  ConversationalRetrievalQAChain,
} = require("langchain/chains");
const { OpenAI } = require("langchain/llms");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const Razorpay = require("razorpay");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { planFeature } = require("../constant");

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

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLIC_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const stripePriceId = {
  basic: "price_1NRoeFSCantt08qFobyAgiih",
  pro: "price_1NRodrSCantt08qFBlHiMPsK",
};

const razorpayPriceId = {
  basic: "plan_MCrcfamQerH6gc",
  pro: "plan_MCreq3ULCaedtv",
};

const awsConfig = {
  apiVersion: process.env.AWS_API_VERSION,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
};

const s3 = new AWS.S3(awsConfig);

// functions
const uploadS3AndPineConeFunctionFree = async (file, user, maximumPage) => {
  try {
    const fileName = file.name;
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];
    if (file.mimetype === "application/pdf") {
      const text = await processPdf(file, maximumPage);
      const fileUploadId = await processStoring(file, text, user);
      // Increment the totalFileUsed count
      user.freePlanUsageData.totalFileUsed += 1;
      await user.save();

      return fileUploadId;
    } else {
      const text = await processOtherDocs(file, maximumPage);
      const fileUploadId = await processStoring(file, text, user);
      // Increment the totalFileUsed count
      user.freePlanUsageData.totalFileUsed += 1;
      await user.save();

      return fileUploadId;
      // throw new Error("invalid file type");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
const uploadS3AndPineConeFunctionPaid = async (file, user, maximumPage) => {
  try {
    const fileName = file.name;
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];
    if (file.mimetype === "application/pdf") {
      const text = await processPdf(file, maximumPage);
      const fileUploadId = await processStoring(file, text, user);

      // Increment the totalFileUsed count
      user.paidPlanUsageData.totalFileUsed += 1;
      await user.save();

      return fileUploadId;
    } else {
      const text = await processOtherDocs(file, maximumPage);
      const fileUploadId = await processStoring(file, text, user);
      // Increment the totalFileUsed count
      user.freePlanUsageData.totalFileUsed += 1;
      await user.save();

      return fileUploadId;
      // throw new Error("invalid file type");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
const freeUsageUpload = async (file, user) => {
  // we are getting today date , so we can limit as per the day, per day 2 times  for example
  const todayDate = new Date().getDate(); //for example today is 12
  console.log(todayDate);

  // if todayDate and user saved date is today, we are using today, else we will reset to totalFileUser:0, so user can continue uploading
  if (todayDate === user.freePlanUsageData.todayDate) {
    if (
      user.freePlanUsageData.totalFileUsed <
      planFeature["free"].maxFileUsedPerDay
    ) {
      const fileUploadId = await uploadS3AndPineConeFunctionFree(
        file,
        user,
        planFeature["free"].maximumPage
      );
      return fileUploadId;
    } else {
      throw new Error("Limit Execeded");
    }
  } else {
    const updatedFreeUsageUser = await User.findByIdAndUpdate(
      user._id,
      {
        // freePlanUsageData: {
        //   todayDate,
        //   totalFileUsed: 0,
        // },
        $set: {
          "freePlanUsageData.todayDate": todayDate,
          "freePlanUsageData.totalFileUsed": 0,
        },
      },
      {
        new: true,
      }
    );
    if (
      updatedFreeUsageUser.freePlanUsageData.totalFileUsed <
      planFeature["free"].maxFileUsedPerDay
    ) {
      const fileUploadId = await uploadS3AndPineConeFunctionFree(
        file,
        updatedFreeUsageUser,
        planFeature["free"].maximumPage
      );
      return fileUploadId;
    } else {
      throw new Error("Limit Execeded");
    }
  }
};
const paidUsageUpload = async (file, user, planFeature) => {
  // we are getting today date , so we can limit as per the day, per day 2 times  for example
  const todayDate = new Date().getDate(); //for example today is 12
  console.log(todayDate);

  // if todayDate and user saved date is today, we are using today, else we will reset to totalFileUser:0, so user can continue uploading
  if (todayDate == user.paidPlanUsageData.todayDate) {
    if (user.paidPlanUsageData.totalFileUsed < planFeature.maxFileUsedPerDay) {
      const fileUploadId = await uploadS3AndPineConeFunctionPaid(
        file,
        user,
        planFeature.maximumPage
      );
      return fileUploadId;
    } else {
      throw new Error("Limit Execeded");
    }
  } else {
    const updatedPaidUsageUser = await User.findByIdAndUpdate(
      user._id,
      {
        // paidPlanUsageData: {
        //   todayDate,
        //   totalFileUsed: 0,
        // },
        $set: {
          "paidPlanUsageData.todayDate": todayDate,
          "paidPlanUsageData.totalFileUsed": 0,
        },
      },
      {
        new: true,
      }
    );
    if (
      updatedPaidUsageUser.paidPlanUsageData.totalFileUsed <
      planFeature.maxFileUsedPerDay
    ) {
      const fileUploadId = await uploadS3AndPineConeFunctionPaid(
        file,
        updatedPaidUsageUser,
        planFeature.maximumPage
      );
      return fileUploadId;
    } else {
      throw new Error("Limit Execeded");
    }
  }
};

const processStoring = async (file, text, userData) => {
  // split the text
  try {
    const fileName = file.name;
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];

    const params = {
      Bucket: process.env.BUCKET_NAME,
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
        userId: userData._id.toString(),
      });
      const user = {
        userId: userData._id.toString(),
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

      return fileUploadRes._id;
    } else {
      throw new Error("File Upload Failed");
    }
  } catch (error) {
    console.log(error);
    throw new Error("File Upload Failed");
  }
};
const processPdf = async (file, maximumPage) => {
  const data = await pdfParse(file);
  if (data.numpages <= maximumPage) {
    return data.text;
  } else {
    throw new Error(`Your limit is upto ${maximumPage} pages`);
  }
};
const processOtherDocs = async (file, maximumPage) => {
  try {
    console.log("other docs");
    const extractText = () => {
      return new Promise((resolve, reject) => {
        textract.fromBufferWithMime(file.mimetype, file.data, (error, text) => {
          if (error) {
            console.log("error2", error);
            reject(new Error("Invalid File Type"));
          } else {
            resolve(text);
          }
        });
      });
    };

    const text = await extractText();

    const averageCharsPerPage = 2000; // Adjust as needed for your document
    const pageCount = Math.ceil(text.length / averageCharsPerPage);

    console.log({ pageCount });

    if (pageCount <= maximumPage) {
      return text;
    } else {
      throw new Error(`Your limit is upto ${maximumPage} pages`);
    }
  } catch (error) {
    console.log("error1", error);
    throw new Error(error.message);
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { email } = req.user;
    console.log(email);
    const user = await User.findOne({ email });

    if (user.isStripe === true || user.isRazorpay === true) {
      // continue
      // before uploading need to check use is status is active or not
      let isActive;

      // if (user.isStripe) {
      //   const subscriptions = await stripe.subscriptions.list(
      //     {
      //       customer: user.stripeCustomerId,
      //       status: "all",
      //       expand: ["data.default_payment_method"],
      //     },
      //     {
      //       apiKey: process.env.STRIPE_SECRET_KEY,
      //     }
      //   );

      //   console.log(subscriptions);
      //   isActive =
      //     subscriptions?.data[0].status === "active" ? "active" : "inactive";
      // } else if (user.isRazorpay) {
      //   // need to check for razorpay is plan is active or not
      //   // isActive =
      //   const subData = await instance.subscriptions.fetch(
      //     user.razorpaySubscriptionId
      //   );
      //   isActive = subData.status === "active" ? "active" : "inactive";
      // }

      // we check this for if user cancel inbetween before the subscription expired
      const isExpired =
        user?.paidPlanUsageData?.expiry >= Math.floor(Date.now() / 1000); // 1689388322 > 1689302047

      console.log({ isExpired });
      // console.log({ isActive });

      // if active then continue to paid else free
      if (isExpired) {
        // need to check for which plan user subscribed , [free, basic, pro]
        if (user.plan === "basic") {
          // basic plan

          const fileUploadId = await paidUsageUpload(
            req.files.file,
            user,
            planFeature["basic"]
          );
          console.log("success basic");
          return res.json(fileUploadId);
        } else if (user.plan === "pro") {
          // pro plan

          const fileUploadId = await paidUsageUpload(
            req.files.file,
            user,
            planFeature["pro"]
          );
          console.log("success pro");

          return res.json(fileUploadId);
        }
      } else {
        // free plan
        const fileUploadId = await freeUsageUpload(req.files.file, user);
        console.log("success free");

        return res.json(fileUploadId);
      }
    } else {
      // free plan
      const fileUploadId = await freeUsageUpload(req.files.file, user);
      console.log("success free");

      return res.json(fileUploadId);
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);

    res.status(400).json({
      error: error.message ? error.message : "Something Went Wrong",
    });
  }
};

// query pinecone

const queryPineConeFunctionFree = async (message, fileId, user) => {
  try {
    await FileQuery.create({
      userId: user._id,
      fileId: fileId,
      message: message,
      isHuman: true,
    });
    // query the pinecone
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
        filter: {
          userId: user._id.toString(),
          fileId: fileId,
        },
      }
    );

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.6,
      maxTokens: 256,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(1), {
      returnSourceDocuments: true,
    });

    const chainRes = await chain.call({
      query: message,
    });

    const createdAI = await FileQuery.create({
      userId: user._id,
      fileId: fileId,
      message: chainRes.text,
      isHuman: false,
    });
    // Increment the totalQuestionsAsked count

    console.log(user);
    user.freePlanUsageData.totalQuestionsAsked += 1;
    await user.save();

    return createdAI;
  } catch (error) {
    console.log(error);
    throw new Error("Upload Failed");
  }
};
const freeUsageQuery = async (message, fileId, user) => {
  // we are getting today date , so we can limit as per the day, per day 2 times  for example
  const todayDate = new Date().getDate(); //for example today is 12
  console.log(todayDate);

  // if todayDate and user saved date is today, we are using today, else we will reset to totalFileUser:0, so user can continue uploading
  if (todayDate === user.freePlanUsageData.todayDate) {
    if (
      user.freePlanUsageData.totalQuestionsAsked <
      planFeature["free"].maxQuestionsAskedPerDay
    ) {
      const response = await queryPineConeFunctionFree(message, fileId, user);
      return response;
    } else {
      throw new Error("Limit Execeded");
    }
  } else {
    const updatedFreeUsageUser = await User.findByIdAndUpdate(
      user._id,
      {
        // freePlanUsageData: {
        //   todayDate,
        //   totalQuestionsAsked: 0,
        // },
        $set: {
          "freePlanUsageData.todayDate": todayDate,
          "freePlanUsageData.totalQuestionsAsked": 0,
        },
      },
      {
        new: true,
      }
    );

    console.log("updated", updatedFreeUsageUser);
    if (
      updatedFreeUsageUser.freePlanUsageData.totalQuestionsAsked <
      planFeature["free"].maxQuestionsAskedPerDay
    ) {
      const response = await queryPineConeFunctionFree(
        message,
        fileId,
        updatedFreeUsageUser
      );
      return response;
    } else {
      throw new Error("Limit Execeded");
    }
  }
};
const queryPineConeFunctionPaid = async (message, fileId, user) => {
  try {
    await FileQuery.create({
      userId: user._id,
      fileId: fileId,
      message: message,
      isHuman: true,
    });
    // query the pinecone
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
        filter: {
          userId: user._id.toString(),
          fileId: fileId,
        },
      }
    );

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.6,
      maxTokens: 256,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(1), {
      returnSourceDocuments: true,
    });

    const chainRes = await chain.call({
      query: message,
    });

    const createdAI = await FileQuery.create({
      userId: user._id,
      fileId: fileId,
      message: chainRes.text,
      isHuman: false,
    });
    // Increment the totalQuestionsAsked count

    console.log(user);

    user.paidPlanUsageData.totalQuestionsAsked += 1;
    await user.save();

    return createdAI;
  } catch (error) {
    console.log(error);
    throw new Error("Upload Failed");
  }
};
const paidUsageQuery = async (message, fileId, user, planFeature) => {
  // we are getting today date , so we can limit as per the day, per day 2 times  for example
  const todayDate = new Date().getDate(); //for example today is 12
  console.log(todayDate);

  // if todayDate and user saved date is today, we are using today, else we will reset to totalFileUser:0, so user can continue uploading
  if (todayDate == user.paidPlanUsageData.todayDate) {
    if (
      user.paidPlanUsageData.totalQuestionsAsked <
      planFeature.maxQuestionsAskedPerDay
    ) {
      const response = await queryPineConeFunctionPaid(message, fileId, user);
      return response;
    } else {
      throw new Error("Limit Execeded");
    }
  } else {
    const updatedPaidUsageUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          "paidPlanUsageData.todayDate": todayDate,
          "paidPlanUsageData.totalQuestionsAsked": 0,
        },
      },
      {
        new: true,
      }
    );
    if (
      updatedPaidUsageUser.paidPlanUsageData.totalQuestionsAsked <
      planFeature.maxQuestionsAskedPerDay
    ) {
      const response = await queryPineConeFunctionPaid(
        message,
        fileId,
        updatedPaidUsageUser
      );
      return response;
    } else {
      throw new Error("Limit Execeded");
    }
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { email } = req.user;
    const { message, fileId } = req.body;

    const user = await User.findOne({ email });

    if (user.isStripe === true || user.isRazorpay === true) {
      // continue
      const isExpired =
        user?.paidPlanUsageData?.expiry >= Math.floor(Date.now() / 1000); // 1689388322 > 1689302047

      console.log({ isExpired });

      // if active then continue to paid else free
      if (isExpired) {
        // need to check for which plan user subscribed , [free, basic, pro]
        if (user.plan === "basic") {
          // basic plan

          const response = await paidUsageQuery(
            message,
            fileId,
            user,
            planFeature["basic"]
          );
          console.log("success basic");
          return res.json(response);
        } else if (user.plan === "pro") {
          // pro plan

          const response = await paidUsageQuery(
            message,
            fileId,
            user,
            planFeature["pro"]
          );
          console.log("success pro");

          return res.json(response);
        }
      } else {
        // free plan
        const response = await freeUsageQuery(message, fileId, user);
        console.log("success free");

        return res.json(response);
      }
    } else {
      // free plan
      const response = await freeUsageQuery(message, fileId, user);
      console.log("success free");

      return res.json(response);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

// payment gateway
exports.subscribeStripe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    let customerId;
    if (user.stripeCustomerId) {
      customerId = user.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create(
        {
          email: user.email,
        },
        {
          apiKey: process.env.STRIPE_SECRET_KEY,
        }
      );
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customerId,
        line_items: [
          {
            price: stripePriceId[req.body.plan],
            quantity: 1,
          },
        ],
        // allow_promotion_codes: true,

        success_url: "http://localhost:3000/",
        cancel_url: "http://localhost:3000/checkout",
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    // no  need to update twice the customerId if alread there need to change
    user.stripeCustomerId = customerId;
    user.save();
    // console.log(session);
    res.json(session.url);
  } catch (err) {
    console.log(err);
  }
};
exports.subscribeRazorpay = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    let customerId;
    if (user.razorpayCustomerId) {
      customerId = user.razorpayCustomerId;
    } else {
      console.log("else");
      const customer = await instance.customers.create({
        email: user.email,
      });

      console.log(customer);
      customerId = customer.id;
    }

    const subscription = await instance.subscriptions.create({
      plan_id: razorpayPriceId[req.body.plan],
      customer_id: customerId,
      total_count: 12,
      customer_notify: 1,
    });

    // no  need to update twice the customerId if alread there need to change
    user.razorpayCustomerId = customerId;
    user.razorpaySubscriptionId = subscription.id;
    user.save();

    console.log(subscription);
    res.json(subscription);
  } catch (err) {
    console.log(err);
  }
};
exports.webhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event = request.body;
  console.log(event);
  // try {
  //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  // } catch (err) {
  //   response.status(400).send(`Webhook Error: ${err.message}`);
  //   return;
  // }
  const customerId = event.data.object.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });

  // Handle the event
  switch (event.type) {
    case "invoice.paid":
      const invoicePaid = event.data.object;

      console.log("invoice paid", invoicePaid);
      if (user) {
        // we don't need the stripeSubscriptionId, we are list all the subscription in upload

        // anthor one this, that id can be get from retrive all sub also, no need , i will remove it
        user.stripeSubscriptionId = invoicePaid.subscription;

        if (invoicePaid.amount_paid === 20000) {
          user.plan = "basic";
        } else if (invoicePaid.amount_paid === 100000) {
          user.plan = "pro";
        }
        user.isRazorpay = false;
        user.isStripe = true;
        const expiryDate = event.data.object.lines.data[0].period.end;

        user.paidPlanUsageData.expiry = expiryDate;

        await user.save();
      }
      // Then define and call a function to handle the event invoice.paid
      break;

    // update the mongodb here
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded

      if (user) {
        user.paidPlanUsageData.totalFileUsed = 0;
        user.paidPlanUsageData.totalQuestionsAsked = 0;
        await user.save();
      }
      console.log("payment intent", paymentIntentSucceeded);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
exports.razorpayWebhook = async (request, response) => {
  /*

	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
*/

  let event = request.body;
  const customerId = event.payload.payment.entity.customer_id;

  const user = await User.findOne({ razorpayCustomerId: customerId });

  // Handle the event
  switch (request.body.event) {
    case "order.paid":
      console.log("order paid");
      if (user) {
        if (event.payload.payment.entity.amount === 20000) {
          user.plan = "basic";
        } else if (event.payload.payment.entity.amount === 100000) {
          user.plan = "pro";
        }

        user.isRazorpay = true;
        user.isStripe = false;

        user.paidPlanUsageData.totalFileUsed = 0;
        user.paidPlanUsageData.totalQuestionsAsked = 0;

        // this is not working, sometime end_at : null

        // need to get the expiry date from the razorpay

        // const subscriptionData = await instance.subscriptions.fetch(
        //   user.razorpaySubscriptionId
        // );

        // console.log("sub id", user.razorpaySubscriptionId);

        const currentDate = Math.floor(Date.now() / 1000);
        const expiryDate = currentDate + 30 * 24 * 60 * 60;

        console.log({ currentDate });
        console.log({ expiryDate });

        user.paidPlanUsageData.expiry = expiryDate;

        await user.save();
      }
      break;

    default:
      console.log(`Unhandled event type`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

exports.whichplan = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (user.isStripe === true || user.isRazorpay === true) {
      // continue
      // before uploading need to check use is status is active or not
      // let isActive;
      // if (user.isStripe) {
      //   const subscriptions = await stripe.subscriptions.list(
      //     {
      //       customer: user.stripeCustomerId,
      //       status: "all",
      //       expand: ["data.default_payment_method"],
      //     },
      //     {
      //       apiKey: process.env.STRIPE_SECRET_KEY,
      //     }
      //   );
      //   isActive =
      //     subscriptions?.data[0].status === "active" ? "active" : "inactive";
      // } else if (user.isRazorpay) {
      //   const subData = await instance.subscriptions.fetch(
      //     user.razorpaySubscriptionId
      //   );
      //   isActive = subData.status === "active" ? "active" : "inactive";
      // }

      // if active then continue to paid else free
      const isExpired =
        user?.paidPlanUsageData?.expiry >= Math.floor(Date.now() / 1000); // 1689388322 > 1689302047

      console.log({ isExpired });

      if (isExpired) {
        // need to check for which plan user subscribed , [free, basic, pro]
        if (user.plan === "basic") {
          // basic plan
          return res.json("basic");
        } else if (user.plan === "pro") {
          // pro plan
          return res.json("pro");
        }
      } else {
        // free plan
        return res.json("free");
      }
    } else {
      // free plan
      return res.json("free");
    }
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .json(error.message ? error.message : "some thing went wrong");
  }
};
exports.cancelSubsciption = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    console.log(user);

    if (user.isStripe) {
      const deleted = await stripe.subscriptions.cancel(
        user.stripeSubscriptionId
      );

      user.plan = "free";
      user.save();
      console.log(deleted);
      res.json("success");
    } else if (user.isRazorpay) {
      const deleted = await instance.subscriptions.cancel(
        user.razorpaySubscriptionId
      );
      user.plan = "free";
      user.save();
      console.log(deleted);
      res.json("success");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
