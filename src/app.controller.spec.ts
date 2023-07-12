/**
 * @file App controller spec
 * @module app/controller.spec
 * @author Surmon <https://github.com/surmon-china>
 */

import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController]
    }).compile()
  })

  describe('root', () => {
    it('should return "object"', () => {
      const appController = app.get<AppController>(AppController)
      expect(typeof appController.root()).toBe('object')
    })
  })
})
