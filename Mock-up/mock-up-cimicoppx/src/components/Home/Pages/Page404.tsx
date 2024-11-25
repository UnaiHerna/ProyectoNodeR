import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-cimico text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold animate-bounce">404</h1>
        <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
        <p className="mt-2 text-lg">Oops! It seems you've wandered into the sludge tank of the internet. Let's get you back on the clean path!</p>
        <div className="mt-8">
          <a
            href="/today"
            className="inline-block px-6 py-3 text-xl font-semibold text-cimicoText bg-transparent rounded-lg transition-all duration-300 hover:bg-cimico hover:text-white transform hover:scale-105"
          >
            <img className="scale-50" src="/logo-cimico.png" alt="" />Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
