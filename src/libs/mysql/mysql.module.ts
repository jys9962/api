import { DynamicModule, Module } from '@nestjs/common';
import { getDataSourceName, TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions';
import { MysqlUtil } from '@/libs/mysql/util/mysql.util';
import { extendTypeOrm } from '@/libs/mysql/extend/orm-extend';

type MysqlOption = Pick<MysqlConnectionCredentialsOptions, 'host' | 'username' | 'password' | 'database'>;

@Module({})
export class MysqlModule {

  static forRoot(
    name: string,
    connectionOption: MysqlOption,
    entities: Function[],
  ): DynamicModule {
    return {
      module: MysqlModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory() {
            return {
              type: 'mysql',
              name: name,
              port: 3306,
              host: connectionOption.host,
              username: connectionOption.username,
              password: connectionOption.password,
              database: connectionOption.database,
              entities: entities,
              synchronize: false,
              logging: false,
              logger: 'advanced-console',
              namingStrategy: new SnakeNamingStrategy(),
            };
          },
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error('Invalid options passed');
            }

            return addTransactionalDataSource(new DataSource(options));
          },
        }),
      ],
      providers: [
        ...entities.map(
          (entity) => ({
            provide: MysqlUtil.getName(name, entity),
            useFactory: (
              dataSource: DataSource,
            ) => {
              const repository = dataSource.getRepository(entity);
              return extendTypeOrm(repository);
            },
            inject: [DataSource],
          }),
        ),
      ],
      exports: [
        ...entities.map(
          (entity) => MysqlUtil.getName(name, entity),
        ),
      ],
    };
  }

}
