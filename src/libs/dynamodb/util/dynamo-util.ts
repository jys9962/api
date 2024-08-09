import { Dynamo, FormatObject } from '@/libs/dynamodb/interface/dynamo-entity.interface';

export namespace DynamoUtil {

  const isTemplate = (t: string) => t.startsWith('{') && t.endsWith('}');
  const parseTemplate = (t: string) => t.slice(1, t.length - 1);

  export const createKey = <TFormat extends string>(
    format: TFormat,
    value: FormatObject<TFormat>,
  ): Dynamo.Key<TFormat> => {
    return format
      .split('#')
      .map(
        (t) => isTemplate(t)
          ? value[parseTemplate(t) as keyof typeof value]
          : t,
      )
      .join('#') as Dynamo.Key<TFormat>;
  };

  export const parseKey = <TFormat extends string>(
    format: TFormat,
    value: Dynamo.Key<TFormat>,
  ): FormatObject<TFormat> => {
    const valueArray = value.split('#');

    return format
      .split('#')
      .reduce(
        (
          acc,
          t,
          i,
        ) => {
          if (!isTemplate(t)) {
            return acc;
          }

          const key = parseTemplate(t);
          acc[key] = valueArray[i];
          return acc;
        },
        {} as any,
      );
  };

}
