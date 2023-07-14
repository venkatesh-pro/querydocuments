import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

const plan = () => {
  const [plan, setPlan] = useState("");
  const [payments, setPayments] = useState("");
  const [planFromDb, setPlanFromDb] = useState("");
  const choosePricing = async (e) => {
    setPlan(e.target.value);
  };
  const choosePayments = async (e) => {
    console.log(e.target.value);
    setPayments(e.target.value);
  };
  const { auth } = useSelector((state) => ({ ...state }));
  const router = useRouter();

  const handleSubmit = async () => {
    if (payments === "stripe") {
      const { data } = await axios.post(
        `http://localhost:5000/api/subscribe-stripe`,
        {
          plan: plan,
        },
        {
          headers: {
            authToken: auth.token,
          },
        }
      );

      console.log(data);

      router.push(data);
    } else if (payments === "razorpay") {
      const { data } = await axios.post(
        `http://localhost:5000/api/subscribe-razorpay`,
        {
          plan: plan,
        },
        {
          headers: {
            authToken: auth.token,
          },
        }
      );

      console.log(data);

      const options = {
        key: "rzp_test_1A0HbCSTf0GJgA",
        subscription_id: data.id,
        name: "querydocuments",
        description: "Monthly Test Plan",
        // image: "/your_logo.jpg",
        handler: function (response) {
          alert(response.razorpay_payment_id),
            alert(response.razorpay_subscription_id),
            alert(response.razorpay_signature);
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
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      // router.push(data);
    }
  };
  const whichplanFunction = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/whichplan`, {
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
      const { data } = await axios.post(
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
  return (
    <>
      <Head>
        <title>Plan</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>

      <div>
        <div>
          {/* for plans */}
          <div>
            <input
              type="radio"
              id="basic"
              value={"basic"}
              name="price"
              onChange={choosePricing}
            />
            <label htmlFor="basic">Basic</label>
          </div>
          <div>
            <input
              type="radio"
              id="pro"
              value={"pro"}
              name="price"
              onChange={choosePricing}
            />
            <label htmlFor="pro">Pro</label>
          </div>
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          {/* for which payment gateway */}
          <div>
            <input
              type="radio"
              id="stripe"
              value={"stripe"}
              name="payments"
              onChange={choosePayments}
            />
            <label htmlFor="stripe">Stripe</label>
          </div>
          <div>
            <input
              type="radio"
              id="razorpay"
              value={"razorpay"}
              name="payments"
              onChange={choosePayments}
            />
            <label htmlFor="razorpay">Razorpay</label>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {planFromDb && <div>User is using {planFromDb} plan</div>}

        <div>
          {planFromDb !== "free" && planFromDb !== "" ? (
            <button onClick={handleCancelSubscription}>
              cancel subscription
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default plan;
