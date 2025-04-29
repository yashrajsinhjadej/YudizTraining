const status = {
    OK: 200,
    Create: 201,
    Deleted: 204,
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    Forbidden: 403,
    NotAcceptable: 406,
    ExpectationFailed: 417,
    Locked: 423,
    InternalServerError: 500,
    UnprocessableEntity: 422,
    ResourceExist: 409,
    TooManyRequest: 429,
  };
  
  function responseHandler(res, { statusmsg, sMsg, sData }) {
    return res.status(status[statusmsg] || 500).json({ sMsg, sData });
  }
  
  module.exports = { responseHandler };
  