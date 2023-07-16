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

const checkout = () => {
  const [planChoosen, setPlanChoosen] = useState("");
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
    if (planChoosen == "" || paymentMethodChoosen == "") {
      // toast
      return;
    }
    if (paymentMethodChoosen === "stripe") {
      const { data } = await api.post(
        `http://localhost:5000/api/subscribe-stripe`,
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

      router.push(data);
    } else if (paymentMethodChoosen === "razorpay") {
      const { data } = await api.post(
        `http://localhost:5000/api/subscribe-razorpay`,
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY,
        subscription_id: data.id,
        name: "querydocuments",
        description: "Monthly Subscription",
        // image: "/your_logo.jpg",
        handler: function (response) {
          console.log(response);
          // alert(response.razorpay_payment_id),
          //   alert(response.razorpay_subscription_id),
          //   alert(response.razorpay_signature);
        },
        // prefill: {
        //   name: "Gaurav Kumar",
        //   email: "gaurav.kumar@example.com",
        //   contact: "+919876543210",
        // },
        // notes: {
        //   note_key_1: "Tea. Earl Grey. Hot",
        //   note_key_2: "Make it so.",
        // },
        theme: {
          color: "#EEE6D8",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      // router.push(data);
    }
  };
  useEffect(() => {
    sessionStorage.getItem("selectedPlan")
      ? setPlanChoosen(sessionStorage.getItem("selectedPlan"))
      : setPlanChoosen("pro");
  }, []);
  return (
    <>
      <Head>
        <title>Checkout</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>
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
              onChange={choosePayments}
            />
            <label
              htmlFor="stripe"
              className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
            >
              Credit/Debit Card {isDesktop && `(Securly processed via Stripe)`}
            </label>
          </div>
          <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
            <input
              id="razorpay"
              value={"razorpay"}
              type="radio"
              name="payments"
              className="w-4 h-4 "
              onChange={choosePayments}
            />
            <label
              htmlFor="razorpay"
              className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
            >
              UPI/Netbanking/Cards
              {isDesktop && `(Securly processed via Razorpay)`}
            </label>
          </div>
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
              className="mt-3 border border-gray-200 rounded dark:border-gray-700 w-full p-2 bg-black text-white disabled:bg-gray-400"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default checkout;

/*

  const whichplanFunction = async () => {
    try {
      const { data } = await api.get(`http://localhost:5000/api/whichplan`, {
        headers: {
          authToken: auth.token,
        },
      });
      console.log(data);

      setPlanFromDb(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      whichplanFunction();
    }
  }, [auth]);

  const handleCancelSubscription = async () => {
    try {
      console.log("clicked");
      // post for security reason
      const { data } = await api.post(
        `http://localhost:5000/api/cancelSubscribe`,
        {},
        {
          headers: {
            authToken: auth.token,
          },
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };


  */
