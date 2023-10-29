export async function sendOtp(phoneNumber: string) {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/auth/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.errors) {
        const errors: { [key: string]: string } = {};
        data.errors.forEach((error: any) => {
          errors[error.path] = error.msg;
        });
        throw errors;
      } else if (response.status === 500 && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }

    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}
