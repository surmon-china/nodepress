/**
 * @file Global meta constant
 * @module constant/meta
 * @author Surmon <https://github.com/surmon-china>
 */

import * as constants from '@nestjs/common/constants'
import { CACHE_KEY_METADATA } from '@nestjs/common/cache/cache.constants'

// responser
export const HTTP_ERROR_CODE = '__customHttpErrorCode__'
export const HTTP_ERROR_MESSAGE = '__customHttpErrorMessage__'

export const HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA
export const HTTP_SUCCESS_MESSAGE = '__customHttpSuccessMessage__'

export const HTTP_RESPONSE_TRANSFORM = '__customHttpResponseTransform__'
export const HTTP_RESPONSE_TRANSFORM_TO_PAGINATE = '__customHttpResponseTransformToPaginate__'

// cache
export const HTTP_CACHE_KEY_METADATA = CACHE_KEY_METADATA
export const HTTP_CACHE_TTL_METADATA = '__customHttpCacheTTL__'

// guest request
export const GUEST_REQUEST_METADATA = '__customGuestRequestOption__'
