import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';
import { validatorHandler } from '../../../helpers/requests/ErrorHandler';

export function request1(all_vendor = true) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/movers/vendormovers`, {
        all_vendor: true,
        api_token: Auth.getToken()
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function request2() {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/movers/getfilter`, {
        api_token: Auth.getToken()
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
