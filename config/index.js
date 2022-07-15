/**
 * Config file depending on the env vars
 * @author dassiorleando
 */
 module.exports = {
    ENV: process.env.NODE_ENV || "dev",
    PORT: process.env.NODE_PORT || "5555",
  
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5555',
    WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
    
    // The JWT secret key
    JWT_KEY: process.env.JWT_KEY,
  
    // Google re-captcha secret key
    RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
  
    // AWS credentials
    AWS_ACCESS_KEY:
      process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY:
      process.env.AWS_SECRET_KEY,
  
    // Redis credentials
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_AUTH: process.env.REDIS_AUTH,
  
    // Mailchimp API key for mailing list integration on registration.
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  
    MONGODB_URI: process.env.MONGODB_URI,
  
    // Dynamo DB table name
    USER_SOCKETS_TABLE:
      process.env.NODE_ENV !== "prod"
        ? "DoUHaveSocketsUsersDev"
        : "DoUHaveSocketsUsersProd",
    USER_ROOMS_TABLE:
      process.env.NODE_ENV !== "prod" ? "DoUHaveRoomsDev" : "DoUHaveRoomsProd",
    USER_MESSAGES_TABLE:
      process.env.NODE_ENV !== "prod"
        ? "DoUHaveMessagesDev"
        : "DoUHaveMessagesProd",
    ROOM_LAST_MESSAGES_TABLE:
      process.env.NODE_ENV !== "prod"
        ? "DoUHaveLastMessagesDev"
        : "DoUHaveLastMessagesProd",
  };
  