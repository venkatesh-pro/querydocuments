1. razorpay and stripe webhook security
   <!-- 2. we only check user.isStripe not user.isRazorpay in upload controller -->
   <!-- 3. cancel subscription for razorpay -->
   <!-- 2. maximumPage check -->
   <!-- 3. multiple format docs , epub and url  -->
   <!-- 3. query check -->
   <!-- 2. account page for subscription view, cancel -->
2. pinecone to qdrant
3. file upload progress
4. url feature
5. login and register page design
6. if subscribed we need to update the localstorage plan : ''
7. intimate after payment success or failure
8. intimate after cancel payment
<!-- 8. different logic, using expiry date, every time checking the subscription id , create error
   {
   statusCode: 429,
   error: { description: 'Too many requests', code: 'BAD_REQUEST_ERROR' }
   } -->
