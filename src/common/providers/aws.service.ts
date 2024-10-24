import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

import type { IFile } from '../interfaces'
import { GeneratorService } from './generator.service'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client

  constructor(
    public configService: ConfigService,
    public generatorService: GeneratorService
  ) {
    const awsS3Config = this.configService.get('s3Bucket')
    this.s3 = new S3Client({
      region: awsS3Config.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: awsS3Config.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: awsS3Config.AWS_S3_SECRET_ACCESS_KEY
      }
    })
  }

  async uploadImage(file: IFile): Promise<any> {
    const fileName = this.generatorService.fileName(
      <string>mime.extension(file.mimetype)
    )
    const key = 'images/' + fileName
    const bucketName = this.configService.get('s3Bucket.AWS_S3_BUCKET_NAME')
    const links: string[] = []

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype || undefined
    })

    await this.s3.send(command)

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`
    links.push(imageUrl)

    return links
  }
}
