const categoriesModel = require("../models/categories");
const form = require("../helpers/form");

module.exports = {
  categoryAll: (_, res) => {
    categoriesModel
      .categoryAll()
      .then((data) => {
        form.nested(res, data);
      })
      .catch((err) => {
        form.error(res, err);
      });
  },

  getCategoryById: (reqBody, res) => {
    const { id } = reqBody.params;
    // console.log(body);
    // console.log(id);
    categoriesModel
      .getCategoryById(id, res)
      .then((data) => {
        if (!data.length) {
          res.status(404).json({
            msg: "Data Not Found",
            status: 404,
          });
        } else {
          form.nested(res, data[0]);
        }
      })
      .catch((err) => {
        form.error(res, err);
      });
  },

  editCategory: (req, res) => {
    const { body } = req;
    const insertBody = {
      ...body,
    };
    const { id } = req.params;
    categoriesModel
      .editCategory(insertBody, id, res)
      .then((data) => {
        // console.log(data);
        if (data.affectedRows === 0) {
          res.status(404).json({
            msg: "Data Not Found",
            status: 404,
          });
        } else {
          const newResObj = {
            id: id,
            ...insertBody,
          };
          form.success(res, newResObj);
        }
      })
      .catch((err) => {
        form.error(res, err);
      });
  },

  postCategory: (req, res) => {
    const { body } = req;
    const insertBody = {
      ...body,
    };
    console.log(insertBody);
    categoriesModel
      .postCategory(insertBody, res)
      .then((data) => {
        const newResObj = {
          id: data.insertId,
          ...insertBody,
        };
        form.success(res, newResObj);
      })
      .catch((err) => {
        form.error(res, err);
      });
    console.log(req);
  },

  deleteCategory: (reqBody, res) => {
    const { id } = reqBody.params;
    // console.log(body);
    // console.log(id);
    categoriesModel
      .deleteCategory(id, res)
      .then((data) => {
        if (data.affectedRows === 0) {
          res.status(404).json({
            msg: "Data Not Found",
            status: 404,
          });
        } else {
          const resObject = {
            msg: "Data Deleted",
            status: 200,
          };
          res.json(resObject);
        }
      })
      .catch((err) => {
        form.error(res, err);
      });
  },
};
