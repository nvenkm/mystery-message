import React from "react";

const VerificationEmail = ({
  otp,
  username,
}: {
  otp: string;
  username: string;
}) => {
  return (
    <div>
      <h4>Hi, {username}</h4>
      <p>Thankyou for registering with us,</p>
      <p>
        Here&apos;s your OTP: <strong>{otp}</strong>{" "}
      </p>
    </div>
  );
};

export default VerificationEmail;
