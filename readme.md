1. razorpay and stripe webhook security
   <!-- 2. we only check user.isStripe not user.isRazorpay in upload controller -->
   <!-- 3. cancel subscription for razorpay -->
   <!-- 2. maximumPage check -->
   <!-- 3. multiple format docs , epub and url  -->
   <!-- 3. query check -->
2. account page for subscription view, cancel
3. pinecone to qdrant
4. file upload progress
5. url feature
6. login and register page design

7. if subscribed we need to update the localstorage plan : ''

8. different logic, using expiry date, every time checking the subscription id , create error
   {
   statusCode: 429,
   error: { description: 'Too many requests', code: 'BAD_REQUEST_ERROR' }
   }
