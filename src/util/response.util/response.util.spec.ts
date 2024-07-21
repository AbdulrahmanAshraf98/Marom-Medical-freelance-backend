import { ResponseUtil } from './response.util';
import { ApiResponse } from '../../common/interfaces/ApiResponse.interface'; // Adjust import path accordingly

describe('ResponseUtil', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with default values', () => {
      const response: ApiResponse<null> =
        ResponseUtil.createSuccessResponse('Success');
      expect(response).toEqual({
        message: 'Success',
        status: 200,
        data: null,
      });
    });

    it('should create a success response with custom status and data', () => {
      const response: ApiResponse<object> = ResponseUtil.createSuccessResponse(
        'Success',
        201,
        { foo: 'bar' },
      );
      expect(response).toEqual({
        message: 'Success',
        status: 201,
        data: { foo: 'bar' },
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with default values', () => {
      const response: ApiResponse<null> =
        ResponseUtil.createErrorResponse('Error');
      expect(response).toEqual({
        message: 'Error',
        status: 400,
        data: null,
      });
    });

    it('should create an error response with custom status and data', () => {
      const response: ApiResponse<object> = ResponseUtil.createErrorResponse(
        'Error',
        500,
        { details: 'Some error details' },
      );
      expect(response).toEqual({
        message: 'Error',
        status: 500,
        data: { details: 'Some error details' },
      });
    });
  });
});
