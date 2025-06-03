# Google reCAPTCHA Setup Instructions

## 1. Register reCAPTCHA Keys
1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click on the "+ Create" button
4. Enter a label for your site (e.g., "My Website Registration")
5. Select "reCAPTCHA v2" with the "I'm not a robot" checkbox
6. Add your domain(s) to the list (e.g., yourdomain.com)
7. Accept the Terms of Service and click "Submit"
8. You will get your Site Key and Secret Key

## 2. Update Environment Variables
Add the following to your `.env` file:

```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## 3. Compile Assets
After updating the `.env` file, rebuild your assets:

```
npm run dev
```

or for production:

```
npm run build
```

## 4. Test Your Implementation
1. Go to your registration page
2. Verify that the reCAPTCHA widget appears
3. Test the form submission with and without completing the reCAPTCHA to ensure validation works correctly 
