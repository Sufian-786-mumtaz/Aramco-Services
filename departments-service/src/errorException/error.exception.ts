import { SOMETHING_WENT_WRONG_TRY_AGAIN } from '@constants/error.contant';
import { HttpStatus } from '@nestjs/common';

export default async function handleErrorException(
  controllerFunction: () => Promise<any>,
): Promise<any> {
  try {
    return await controllerFunction();
  } catch (error) {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: SOMETHING_WENT_WRONG_TRY_AGAIN,
    };
  }
}
