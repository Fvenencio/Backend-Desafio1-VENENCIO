export const productValidator = (req, res, next) => {
    console.log(req.body);
    if (
      !req.body.title ||
      typeof req.body.title != "string" ||
      !req.body.description ||
      typeof req.body.description != "string" ||
      !req.body.price ||
      typeof req.body.price != "number" ||
      !req.body.code ||
      typeof req.body.code != "string" ||
      !req.body.category ||
      typeof req.body.category != "string" ||
      !req.body.stock ||
      typeof req.body.stock != "number"
    ) {
      return res.status(400).json({ success: false, response: "Invalid body" });
    }
    if (req.body.status === null || req.body.status === undefined) {
      req.body.status = true;
    }
    if (req.body.thumbnails === null || req.body.thumbnails === undefined) {
      req.body.thumbnails = [];
    }
    next();
  };