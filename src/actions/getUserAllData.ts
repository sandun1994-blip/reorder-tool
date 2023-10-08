import getSession from "./getSession";


const getCurrentUserAllData = async () => {
    try {
      const session = await getSession();
//   console.log(session);
  
//       if (!session?.user?.email) {
//         return null;
//       }
//   console.log(session?.backendTokens);
  
      
      return session
    } catch (error: any) {
      return null;
    }
  };
  
  export default getCurrentUserAllData