exports.dashboard = async (req, res, next) => {
    try {
        res.send("send-dashboard");
    } catch (error) {
        next(error);
    }
};