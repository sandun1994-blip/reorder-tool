'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToasterContext = () => {
  return ( 
    <ToastContainer />
   );
}
 
export default ToasterContext;



  
// const PromiseNotify = () =>  toast.promise(
//     fetchData(),
//     {
//       loading: 'loading...',
//       success: 'Successfully get data',
//       error: "error occurs in data",
//     }
//   );


// import React, { useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// const App = () => {
//  const [isLoading, setIsLoading] = useState(false);
//  const [randomUser, setRandomUser] = useState(null);
//  const handleAction = () => {
//    setIsLoading(true);
//    const promise = new Promise((resolve, reject) => {
//      setTimeout(() => {
//        fetch("https://randomuser.me/api/")
//          .then((response) => response.json())
//          .then(({ results }) => {
//            setRandomUser(results[0]);
//            resolve();
//          })
//          .catch(reject);
//      }, 2000);
//    });
//    toast
//      .promise(promise, {
//        loading: "Fetching random user details...",
//        success: "Random user details fetched",
//        error: "An error occurred",
//      })
//      .then(() => {
//        setIsLoading(false);
//      })
//      .catch((error) => {
//        console.error("An error occurred:", error);
//        setIsLoading(false);
//      });
//  };
//  return (
//    <div>
//      <div className="app">
//        {isLoading && <div></div>}
//        {randomUser && (
//          <div>
//            <h3 className="header">Random User:</h3>
//            <p className="name">
//              Welcome{" "}
//              <span className="name1">
//                {`${randomUser.name.first} ${randomUser.name.last}`}
//              </span>
//            </p>
//            <p className="email">{randomUser.email}</p>
//          </div>
//        )}
//      </div>
//      <div className="btn-container">
//        <button onClick={handleAction} className="btn">
//          Fetch Random User
//        </button>
//      </div>
//      <Toaster />
//    </div>
//  );
// };
// export default App;
