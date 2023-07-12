/**
 * @file Global meta constant
 * @module constant/meta
 * @author Surmon <https://github.com/surmon-china>
 */

import * as constants from '@nestjs/common/constants'

// responser
export const HTTP_ERROR_CODE = '__appHttpErrorCode__'
export const HTTP_ERROR_MESSAGE = '__appHttpErrorMessage__'

export const HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA
export const HTTP_SUCCESS_MESSAGE = '__appHttpSuccessMessage__'

export const HTTP_RESPONSE_TRANSFORM = '__appHttpResponseTransform__'
export const HTTP_RESPONSE_TRANSFORM_TO_PAGINATE = '__appHttpResponseTransformToPaginate__'

// cache
export const CACHE_KEY_METADATA = '__appCacheKey__'
export const CACHE_TTL_METADATA = '__appCacheTTL__'

// guest request
export const GUEST_REQUEST_METADATA = '__appGuestRequestOption__'
