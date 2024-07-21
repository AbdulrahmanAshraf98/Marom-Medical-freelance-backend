import { ApiResponse } from '../../common/interfaces/ApiResponse.interface';

export class ResponseUtil {
  static createSuccessResponse(
    message: string,
    status: number = 200,
    data = null,
  ) {
    return {
      message,
      status,
      data,
    };
  }

  static createErrorResponse(
    message: string,
    status: number = 400,
    data = null,
  ): ApiResponse<any> {
    return {
      message,
      status,
      data,
    };
  }
}
