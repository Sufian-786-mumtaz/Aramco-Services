import { SOMETHING_WENT_WRONG_TRY_AGAIN } from '@constants/error.contant';

export default async function handleErrorException(
  controllerFunction: () => Promise<any>,
): Promise<any> {
  try {
    return await controllerFunction();
  } catch (error) {
    return {
      status: 500,
      error: SOMETHING_WENT_WRONG_TRY_AGAIN,
    };
  }
}
