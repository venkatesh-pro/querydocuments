<!-- 1. custom auth token -->

2. login and register page design

3. url feature
4. file upload progress
5. pinecone to qdrant
<!-- final -->
6. already have the country check api and implemented, using that need to change the current inr or dollar
7. only One phonenumber check while register
8. razorpay and stripe webhook security
   <!-- 6. intimate after payment success or failure -->
   <!-- 7. intimate after cancel payment -->
      <!-- 6. if subscribed we need to update the localstorage plan : '' -->
      <!-- 8. different logic, using expiry date, every time checking the subscription id , create error
         {
         statusCode: 429,
         error: { description: 'Too many requests', code: 'BAD_REQUEST_ERROR' }
         } -->
   <!-- 2. we only check user.isStripe not user.isRazorpay in upload controller -->
   <!-- 3. cancel subscription for razorpay -->
   <!-- 2. maximumPage check -->
   <!-- 3. multiple format docs , epub and url  -->
   <!-- 3. query check -->
   <!-- 2. account page for subscription view, cancel -->
