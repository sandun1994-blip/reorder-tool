import getSession from "./getSession";


const getCurrentUser = async () => {
    try {
      const session = await getSession();
//   console.log(session);
  
//       if (!session?.user?.email) {
//         return null;
//       }
//   console.log(session?.backendTokens);
  
      
      return session?.backendTokens?.accessToken
    } catch (error: any) {
      return null;
    }
  };
  
  export default getCurrentUser;