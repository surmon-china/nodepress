import { OptionService } from './option.service';
import { Option } from './option.model';
export declare class OptionController {
    private readonly optionService;
    constructor(optionService: OptionService);
    getOption({ isAuthenticated }: {
        isAuthenticated: any;
    }): Promise<Option>;
    putOption(option: Option): Promise<Option>;
}
