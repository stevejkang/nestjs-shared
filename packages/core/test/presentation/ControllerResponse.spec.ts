import { describe, it, expect } from 'vitest';
import { ControllerResponse, ControllerResponseOnError, ControllerResponseErrorObject } from '../../src/presentation/ControllerResponse';

describe('ControllerResponse', () => {
  it('should be defined (ControllerResponse)', () => {
    const controllerResponse = new ControllerResponse();

    controllerResponse.statusCode = 200;
    controllerResponse.timestamp = 'timestamp';
    controllerResponse.path = 'path';
    controllerResponse.ok = true;

    expect(controllerResponse).toBeDefined();
    expect(controllerResponse).toBeInstanceOf(ControllerResponse);
    expect(controllerResponse.statusCode).toBe(200);
    expect(controllerResponse.timestamp).toBe('timestamp');
    expect(controllerResponse.path).toBe('path');
    expect(controllerResponse.ok).toBe(true);
  });

  it('should be defined (ControllerResponseErrorObject)', () => {
    const error = new ControllerResponseErrorObject();

    error.name = 'BadRequestException';
    error.message = 'Invalid input';
    error.stack = ['at line 1', 'at line 2'];

    expect(error).toBeInstanceOf(ControllerResponseErrorObject);
    expect(error.name).toBe('BadRequestException');
    expect(error.message).toBe('Invalid input');
    expect(error.stack).toStrictEqual(['at line 1', 'at line 2']);
  });

  it('should be defined (ControllerResponseOnError)', () => {
    const controllerResponseOnError = new ControllerResponseOnError();

    controllerResponseOnError.statusCode = 200;
    controllerResponseOnError.timestamp = 'timestamp';
    controllerResponseOnError.path = 'path';
    controllerResponseOnError.ok = true;
    controllerResponseOnError.error = {
      name: 'BadRequestException',
      message: 'message',
      stack: ['stack'],
    };

    expect(controllerResponseOnError).toBeDefined();
    expect(controllerResponseOnError).toBeInstanceOf(ControllerResponseOnError);
    expect(controllerResponseOnError.statusCode).toBe(200);
    expect(controllerResponseOnError.timestamp).toBe('timestamp');
    expect(controllerResponseOnError.path).toBe('path');
    expect(controllerResponseOnError.ok).toBe(true);
    expect(controllerResponseOnError.error.message).toBe('message');
    expect(controllerResponseOnError.error.stack).toStrictEqual(['stack']);
  });
});
