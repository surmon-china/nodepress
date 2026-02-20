/**
 * @file Option DTO
 * @module module/options/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Option } from './options.model'

export class UpdateOptionsDto extends PartialType(OmitType(Option, ['singleton', 'updated_at'] as const)) {}
