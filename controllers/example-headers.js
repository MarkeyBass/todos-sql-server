export const getExampleHeaders = async (req, res) => {
  const headers = req.headers;
  console.log(headers);
  if (headers["x-user-role"] === "simple-user") {
    return res.status(401).json({
      success: false,
      msg: "Simple User is Unauthorized",
    });
  } else if (headers["x-user-role"] === "admin") {
    return res.status(200).json({
      success: true,
      msg: "Admin is Authorized",
    });
  } else {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized to access this resource",
    });
  }
};
