enum Exceptions {
  INVALID_URL = "url provided is not valid. Please check your domain.",
  DOMAIN_NOT_ON_ALLOW_LIST = "domain is not on the allow list. Please check your domain.",
  PARSE_ERROR_JSON = "Error parsing JSON",
  PARSE_ERROR_NETWORK = "Error due to network connectivity",
  PARSE_ERROR_SERVER = "Error due to server",
}

export default Exceptions;
