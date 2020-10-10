
const bcrypt=require('bcrypt');
const localstrategy=require('passport-local').Strategy;
 async function initialize(passport,getUserByEmail,GetUserById){
    const authenticateUser=async(email,password,done)=>{
      const user=await getUserByEmail(email);
      if (user==null) {
          return done(null,false,{message:'No User Register For This Email'});
      }
      try {
          if(await bcrypt.compare(password,user.Password)){
             return done(null,user)
          }
          else{
              return done(null,false,{message:'Password Incorrect'});
          }
      } catch (e){
          return done(e);
      }
    }
 passport.use(new localstrategy({usernameField:'Email',passwordField:'Password'},await authenticateUser));
 passport.serializeUser((user,done)=>done(null,user.id));
 passport.deserializeUser( async (id,done)=>{
     return done(null,await GetUserById(id));
 });
}
module.exports=initialize;