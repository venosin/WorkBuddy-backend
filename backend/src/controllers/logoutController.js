const logoutController = {};

logoutController.logout = async (req, res) => {
  res.clearCookie("authToken", { 
    httpOnly: true,
    path: '/' 
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export default logoutController;
