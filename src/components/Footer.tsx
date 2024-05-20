import React from "react";
import { FaGithub } from "react-icons/fa";
import { BsGlobe2 } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
const Footer = () => {
  return (
    <footer className="flex flex-col w-full text-center p-8 justify-center items-center gap-5 bg-purple-50">
      <p>
        Thankyou{" "}
        <a
          target="_blank"
          className="underline underline-offset-2 font-semibold"
          href="https://www.youtube.com/@chaiaurcode"
        >
          Hitesh Sir
        </a>{" "}
        for this project! ❤️
      </p>
      <div>
        Homepage design inspiration from:{" "}
        <a
          className="underline underline-offset-2 text-red-600 font-semibold"
          target="_blank"
          href="https://profanity.dev"
        >
          Profanity.dev
        </a>
      </div>
      <div className="flex gap-3">
        <a
          target="_blank"
          href="https://github.com/nvenkm/mystery-message"
          className="text-gray-600"
        >
          <FaGithub size={26} />
        </a>
        <a
          target="_blank"
          href="https://7naveennn.vercel.app"
          className="text-gray-600"
        >
          <BsGlobe2 size={26} />
        </a>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/7naveennn/"
          className="text-gray-600"
        >
          <BsLinkedin size={26} />
        </a>
      </div>
      <p>© 2024 GET-Responses</p>
    </footer>
  );
};

export default Footer;
