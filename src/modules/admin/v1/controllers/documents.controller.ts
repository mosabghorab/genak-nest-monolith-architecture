import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { DocumentsService } from '../services/documents.service';
import { DocumentDto } from '../../../shared/v1/dtos/document.dto';
import { CreateDocumentDto } from '../dtos/documents/create-document.dto';
import { FindAllDocumentsDto } from '../dtos/documents/find-all-documents.dto';
import { UpdateDocumentDto } from '../dtos/documents/update-document.dto';
import { Document } from '../../../shared/entities/document.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.DOCUMENTS)
@Controller({ path: 'admin/documents', version: '1' })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(DocumentDto, 'Document created successfully.')
  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentDto, 'All documents.')
  @Get()
  findAll(@Query() findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return this.documentsService.findAll(findAllDocumentsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentDto, 'One document.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Document> {
    return this.documentsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(DocumentDto, 'Document updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(DocumentDto, 'Document deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Document> {
    return this.documentsService.remove(id);
  }
}
