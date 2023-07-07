import { FindAttributeOptions, IncludeOptions, ModelStatic, Op, Order, WhereOptions } from 'sequelize';
import { PgClient } from '../clients';
import { DBTableName } from '../constants';
import { isUndefined } from 'lodash';
import { log } from './log';

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  LT = 'lt',
  LE = 'le',
  GT = 'gt',
  GE = 'ge',
  BETWEEN = 'between',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  BEGINS_WITH = 'begins_with',
  AND = 'and',
  OR = 'or',
  IN = 'in',
  NOT_IN = 'notIn',
  INCLUDES = 'includes'
}

export class SequelizeHelper {
  private static readonly operatorMap = {
    [FilterOperator.EQ]: Op.eq,
    [FilterOperator.NE]: Op.ne,
    [FilterOperator.LT]: Op.lt,
    [FilterOperator.LE]: Op.lte,
    [FilterOperator.GT]: Op.gt,
    [FilterOperator.GE]: Op.gte,
    [FilterOperator.BETWEEN]: Op.between,
    [FilterOperator.CONTAINS]: Op.like,
    [FilterOperator.NOT_CONTAINS]: Op.notLike,
    [FilterOperator.BEGINS_WITH]: Op.like,
    [FilterOperator.OR]: Op.or,
    [FilterOperator.AND]: Op.and,
    [FilterOperator.IN]: Op.in,
    [FilterOperator.NOT_IN]: Op.notIn,
    [FilterOperator.INCLUDES]: Op.contains
  };

  public static toLimitAndOffset = (
    pageNumber: number | undefined,
    pageSize: number | undefined
  ): {
    limit: number | null;
    offset: number | null;
  } => {
    const limit = pageSize ? +pageSize : null;
    const offset = pageNumber && limit ? (pageNumber - 1) * limit : null;
    return { limit, offset };
  };

  public static getModelAttributeKeys(model: ModelStatic<any>): string[] {
    return Object.keys(model.getAttributes());
  }

  public static toSort(
    db: PgClient,
    tableName: DBTableName,
    includes: IncludeOptions[] = [],
    sortField?: string,
    sortDirection?: SortDirection
  ): { order: Order } {
    const model = db.models()[tableName];
    if (!model) throw new Error(`Couldn't find table ${tableName}`);
    const dbTableFields = Object.keys(model.getAttributes());
    if (sortField && !dbTableFields.includes(sortField))
      throw new Error(`Sort field '${sortField}' doesn't exist in table '${tableName}'. Valid fields: [${dbTableFields.join(', ')}].`);
    if (!sortField || !sortDirection) return this.getDefaultSort(db, tableName, includes);
    return { order: [[sortField, sortDirection]] };
  }

  public static getDefaultSort(
    db: PgClient,
    tableName: DBTableName,
    includes: IncludeOptions[] = []
  ): {
    order: Order;
  } {
    const model = db.models()[tableName];
    if (!model) throw new Error(`No model found for table ${tableName}`);
    switch (tableName) {
      default: {
        return { order: [] };
      }
    }
  }

  public static getDefaultInclude(db: PgClient, tableName: DBTableName): IncludeOptions[] {
    switch (tableName) {
      default:
        return [];
    }
  }

  public static toInclude(db: PgClient, tableName: DBTableName, resolveInfo: any): IncludeOptions[] {
    const include: IncludeOptions[] = [];
    if (!resolveInfo) return include;

    const parentModel = db.models()[tableName];
    if (!parentModel) throw new Error(`Couldn't find model ${tableName}`);

    const parentAssociations = parentModel.associations;
    const parentAssociationKeys = Object.keys(parentAssociations);
    if (!parentAssociationKeys.length) return include;

    const resolveInfoTree = { ...resolveInfo }; //TODO: need to change this
    const currentNodeKeys = Object.keys(resolveInfoTree);
    const associationAliases = currentNodeKeys.filter((key) => parentAssociationKeys.includes(key));
    for (const associationAlias of associationAliases) {
      include.push(
        ...SequelizeHelper.composeInclude(db, tableName, parentAssociations[associationAlias]?.target.tableName, associationAlias, resolveInfoTree)
      );
    }

    log.debug(SequelizeHelper.toInclude.name, { include });
    return include;
  }

  public static toWhere<FilterableInput, RecordType>(filter: FilterableInput): WhereOptions<Partial<RecordType>> {
    const transformedFilter = SequelizeHelper.composeWhere<FilterableInput, RecordType>(filter);
    if (!transformedFilter[Op.and]?.length) delete transformedFilter[Op.and];
    if (!transformedFilter[Op.or]?.length) delete transformedFilter[Op.or];

    return transformedFilter;
  }

  public static toAttributes(db: PgClient, tableName: DBTableName, resolveInfo: []): FindAttributeOptions {
    const minimumAttributes = ['id'];
    if (!resolveInfo) return minimumAttributes;

    const model = db.models()[tableName];
    if (!model) throw new Error(`Couldn't find table ${tableName}`);
    const requestedAttributes = [];
    const modelAttributeKeys = SequelizeHelper.getModelAttributeKeys(model);

    // console.log({ modelAttributeKeys });
    return modelAttributeKeys;
    // const attributes = modelAttributeKeys.filter((key) => requestedAttributes.includes(key));
    // return attributes.length ? attributes : minimumAttributes;
  }

  private static transformOperator(operator: FilterOperator): symbol {
    const transformedOperator = SequelizeHelper.operatorMap[operator];
    if (!transformedOperator) throw new Error(`Operator not found: ${operator}`);
    return transformedOperator;
  }

  private static transformValue(val: string | number | boolean | null, operator: FilterOperator) {
    if (isUndefined(val)) throw new Error(`Value not found: value: ${val} (operator: ${operator}`);
    if (operator === FilterOperator.CONTAINS || operator === FilterOperator.NOT_CONTAINS) return `%${val}%`;
    if (operator === FilterOperator.BEGINS_WITH) return `${val}%`;
    if (operator === FilterOperator.BETWEEN) return [new Date(val[0]), new Date(val[1])] as any;

    return val;
  }

  private static composeWhere = <T, RecordType>(
    filter: T,
    transformedFilter: WhereOptions<RecordType> = { [Op.and]: [], [Op.or]: [] },
    andOrOr: typeof Op.and | typeof Op.or = Op.and
  ): WhereOptions<RecordType> => {
    if (!filter) return transformedFilter;

    const filterEntries = Object.entries(filter);
    if (!filterEntries.length) return transformedFilter;

    for (const [key, value] of filterEntries) {
      if (key === FilterOperator.AND || key === FilterOperator.OR) {
        for (const nestedValue of Object.values(value)) SequelizeHelper.composeWhere(nestedValue, transformedFilter, Op[key]);
        return transformedFilter;
      } else {
        const field = key;
        if (!field) throw new Error(`Invalid field: operator -> field: ${field}`);

        const operatorKeys = Object.keys(value);
        // There must be only one operator per field
        if (operatorKeys.length !== 1) throw new Error(`There can only be one operator per field ${operatorKeys}`);
        const rawOperator = operatorKeys[0] as FilterOperator;
        const rawValue = value[rawOperator];
        const sequelizeOperator = SequelizeHelper.transformOperator(rawOperator);
        const sequelizeValue = SequelizeHelper.transformValue(rawValue, rawOperator);

        const filterStatement = { [field]: { [sequelizeOperator]: sequelizeValue } };
        transformedFilter[andOrOr].push(filterStatement);
      }
    }

    return transformedFilter;
  };

  private static composeInclude = (
    db: PgClient,
    parentTableName: DBTableName,
    associationTableName: DBTableName,
    associationAlias: string,
    graphQLResponseTree: [],
    isRoot = true
  ): IncludeOptions[] => {
    const model = db.models()[associationTableName];
    if (!model) throw new Error(`No model found for associationTableName ${associationTableName} (parentTableName ${parentTableName})`);

    const requestedResponseTree = graphQLResponseTree[associationAlias];
    const requestedResponseKeys = Object.keys(requestedResponseTree);

    const attributeKeys = SequelizeHelper.getModelAttributeKeys(model);
    const attributes = requestedResponseKeys.filter((attribute) => attributeKeys.includes(attribute));

    const nestedAssociationAliases = requestedResponseKeys
      .filter((fieldOrAssociationAliasKey) => Object.keys(requestedResponseTree[fieldOrAssociationAliasKey]).length)
      .filter((fieldOrAssociationAliasKey) => !attributes.includes(fieldOrAssociationAliasKey));

    const includes: IncludeOptions[] = [];
    if (nestedAssociationAliases.length) {
      for (const nestedAssociationAlias of nestedAssociationAliases) {
        const nestedAssociationTableName = model.associations[nestedAssociationAlias]?.target?.tableName;
        if (!nestedAssociationTableName) throw new Error(`Missing target tableName for ${nestedAssociationAlias} on table ${associationTableName}`);
        const throughInclude = SequelizeHelper.getDefaultInclude(db, isRoot ? parentTableName : associationTableName).find(
          (include) => !!include.through && include.as === associationAlias
        );

        includes.push({
          model,
          as: associationAlias,
          attributes,
          ...(throughInclude && { through: throughInclude.through, attributes: throughInclude.attributes }),
          include: SequelizeHelper.composeInclude(
            db,
            associationTableName,
            nestedAssociationTableName,
            nestedAssociationAlias,
            requestedResponseTree,
            false
          )
        });
      }
    } else {
      const throughInclude = SequelizeHelper.getDefaultInclude(db, isRoot ? parentTableName : associationTableName).find(
        (x) => !!x.through && x.as === associationAlias
      );
      includes.push({
        model,
        as: associationAlias,
        ...(throughInclude && { through: throughInclude.through }),
        attributes
      });
    }

    return includes;
  };
}
