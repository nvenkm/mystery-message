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
      <p>
        Here is your verify page link:{" "}
        <a href={`${process.env.HOMEPAGE_URL}/u/${username}`}></a>
      </p>
      <p>Verify code within 1 Hour, else you&apos;ll have to signup again!</p>
    </div>
  );
};

export default VerificationEmail;
