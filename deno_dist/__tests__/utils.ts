import type {ValidationIssue} from '../index.ts';

export function extractIssues(
  result: {data: unknown} | {issues: Array<ValidationIssue>},
): Array<{
  message: string;
  path?: Array<string | number | symbol>;
}> {
  return 'issues' in result
    ? result.issues.map(({message, path}) =>
        path != null ? {message, path} : {message},
      )
    : [];
}
