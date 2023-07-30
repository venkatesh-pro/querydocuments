import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { pricingInfo } from "../constant/HomePage/Pricing";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import api from "../utils/http-client";
import Head from "next/head";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

const checkout = () => {
  const [isUser, setIsUser] = useState(false);

  const [planChoosen, setPlanChoosen] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForPayment, setIsLoadingForPayment] = useState(false);
  const [paymentMethodChoosen, setPaymentMethodChoosen] = useState("");

  const isDesktop = useMediaQuery("(min-width:768px)");

  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const choosePayments = async (e) => {
    console.log(e.target.value);
    setPaymentMethodChoosen(e.target.value);
  };
  const choosePricing = async (e) => {
    console.log(e.target.value);
    setPlanChoosen(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (planChoosen == "" || paymentMethodChoosen == "") {
        // toast
        toast.error("Please Choose Plan");
        console.log("select the plan or payment Method", paymentMethodChoosen);
        return;
      }

      setIsLoadingForPayment(true);
      if (paymentMethodChoosen === "stripe") {
        const { data } = await api.post(
          `/subscribe-stripe`,
          {
            plan: planChoosen,
          },
          {
            headers: {
              authToken: auth.token,
            },
          }
        );

        console.log(data);
        setIsLoadingForPayment(false);

        router.push(data);
      } else if (paymentMethodChoosen === "razorpay") {
        const { data } = await api.post(
          `/subscribe-razorpay`,
          {
            plan: planChoosen,
          },
          {
            headers: {
              authToken: auth.token,
            },
          }
        );

        console.log("data", data);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY,
          subscription_id: data.id,
          name: "querydocuments",
          description: "Monthly Subscription",
          // image: "/your_logo.jpg",
          handler: function (response) {
            console.log(response);
            if (
              response.razorpay_payment_id &&
              response.razorpay_subscription_id &&
              response.razorpay_signature
            ) {
              router.push("/success");
            } else {
              router.push("/failed");
            }
            // alert(response.razorpay_payment_id),
            //   alert(response.razorpay_subscription_id),
            //   alert(response.razorpay_signature);
          },
          prefill: {
            email: data.email,
            contact: `${data.countryCode}${data.phoneNumber}`,
          },
          // notes: {
          //   note_key_1: "Tea. Earl Grey. Hot",
          //   note_key_2: "Make it so.",
          // },
          theme: {
            color: "#EEE6D8",
          },
        };
        setIsLoadingForPayment(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        // router.push(data);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingForPayment(false);
      toast.error(error.response.data.error || "Something Went Wrong");
    }
  };

  useEffect(() => {
    if (!auth?.token) {
      router.push("/login");
    }
  }, [auth]);
  useEffect(() => {
    sessionStorage.getItem("selectedPlan")
      ? setPlanChoosen(sessionStorage.getItem("selectedPlan"))
      : setPlanChoosen("pro");
  }, []);

  const getCountry = async () => {
    if (auth?.token) {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/paymentCheckoutpage`);
        console.log("data:", data);
        setIsLoading(false);

        setCountry(data);

        if (data === "IN") {
          setPaymentMethodChoosen("razorpay");
        } else {
          setPaymentMethodChoosen("stripe");
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      // toast.error("Login To Continue");
    }
  };
  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (auth?.token) {
      setIsUser(true);
    }
  }, [auth]);
  // paymentCheckoutpage;
  return (
    <>
      {isUser && auth?.token ? (
        <>
          <Head>
            <title>Checkout</title>
            <script src="https://checkout.razorpay.com/v1/checkout.js" />
          </Head>
          {isLoading ? (
            <div className="flex items-center flex-col">
              <Loader />
            </div>
          ) : (
            <div
              style={{}}
              className="flex lg:flex-row flex-col gap-3 justify-center items-center h-[92vh] ml-1 lg:ml-10 mr-1 lg:mr-10"
            >
              <div className="w-full bg-[#EEE6D8] lg:p-12 p-7 rounded-2xl">
                <h1 className="font-bold">Payment Method</h1>
                <p className="mt-2 mb-2">
                  Choose how would you like to pay for querydocuments.
                </p>
                <div className="flex mb-2 items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ">
                  <input
                    id="stripe"
                    type="radio"
                    value={"stripe"}
                    name="payments"
                    className="w-4 h-4"
                    defaultChecked={country !== "IN"}
                    onChange={choosePayments}
                  />
                  <label
                    htmlFor="stripe"
                    className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Credit/Debit Card{" "}
                    {isDesktop && `(Securly processed via Stripe)`}
                  </label>
                </div>

                {country === "IN" && (
                  <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                    <input
                      id="razorpay"
                      value={"razorpay"}
                      type="radio"
                      name="payments"
                      className="w-4 h-4 "
                      onChange={choosePayments}
                      defaultChecked={country === "IN"}
                    />
                    <label
                      htmlFor="razorpay"
                      className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      UPI/Netbanking/Cards
                      {isDesktop && `(Securly processed via Razorpay)`}
                    </label>
                  </div>
                )}
              </div>
              <div className="w-full lg:p-12 p-7 bg-[#EEE6D8] rounded-2xl  ">
                <h1 className="">Selected Plan</h1>
                <div className="mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={planChoosen}
                      label="plan"
                      onChange={choosePricing}
                      className=""
                    >
                      <MenuItem value={"basic"}>Basic</MenuItem>
                      <MenuItem value={"pro"}>Pro</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  {planChoosen && (
                    <h1 className="mt-3">
                      Total ${" "}
                      {
                        pricingInfo.find(
                          (info) =>
                            info.plan.toLocaleLowerCase() ===
                            planChoosen.toLocaleLowerCase()
                        ).dollarPrice
                      }
                    </h1>
                  )}
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoadingForPayment}
                    className="mt-3 border border-gray-200 rounded dark:border-gray-700 w-full p-2 bg-black text-white disabled:bg-gray-400"
                  >
                    {isLoadingForPayment ? (
                      <Loader size={"14px"} />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="items-center flex justify-center h-[92vh]">
          Login To see
        </div>
      )}
    </>
  );
};

export default checkout;
