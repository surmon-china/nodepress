import { ArchiveService, ArchiveData } from './archive.service';
export declare class ArchiveController {
    private readonly archiveService;
    constructor(archiveService: ArchiveService);
    getArchive(): Promise<ArchiveData>;
    updateArchive(): Promise<any>;
}
