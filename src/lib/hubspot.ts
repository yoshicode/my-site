/**
 * HubSpot API クライアント
 *
 * 使い方:
 * 1. HubSpot の「プライベートアプリ」でアクセストークンを発行
 * 2. 環境変数 HUBSPOT_ACCESS_TOKEN にトークンをセット
 * 3. 各関数を呼び出してデータを取得
 *
 * 必要なスコープ（プライベートアプリ作成時に選択）:
 * - crm.objects.contacts.read
 * - crm.objects.companies.read
 * - crm.objects.deals.read
 */

const HUBSPOT_API_BASE = "https://api.hubapi.com";

// --------------------------------------------------
// 型定義
// --------------------------------------------------

export interface HubSpotPaging {
  next?: { after: string; link: string };
}

export interface HubSpotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    company?: string;
    jobtitle?: string;
    createdate?: string;
    lastmodifieddate?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotCompany {
  id: string;
  properties: {
    name?: string;
    domain?: string;
    industry?: string;
    city?: string;
    country?: string;
    numberofemployees?: string;
    annualrevenue?: string;
    createdate?: string;
    lastmodifieddate?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname?: string;
    amount?: string;
    dealstage?: string;
    pipeline?: string;
    closedate?: string;
    createdate?: string;
    lastmodifieddate?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotListResponse<T> {
  results: T[];
  paging?: HubSpotPaging;
}

export interface HubSpotProperty {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  description: string;
  groupName: string;
  options: { label: string; value: string }[];
}

// --------------------------------------------------
// 内部ユーティリティ
// --------------------------------------------------

function getAccessToken(): string {
  const token = import.meta.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "HUBSPOT_ACCESS_TOKEN が設定されていません。" +
        ".env ファイルに HUBSPOT_ACCESS_TOKEN=your_token を追加してください。"
    );
  }
  return token;
}

async function hubspotFetch<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${HUBSPOT_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot API エラー [${res.status}]: ${body}`);
  }

  return res.json() as Promise<T>;
}

// --------------------------------------------------
// コンタクト（連絡先）
// --------------------------------------------------

/**
 * コンタクト一覧を取得する
 * @param options.limit    取得件数（最大 100、デフォルト 10）
 * @param options.after    ページネーション用カーソル
 * @param options.properties 追加で取得するプロパティ名の配列
 */
export async function getContacts(options?: {
  limit?: number;
  after?: string;
  properties?: string[];
}): Promise<HubSpotListResponse<HubSpotContact>> {
  const defaultProps = ["firstname", "lastname", "email", "phone", "company", "jobtitle"];
  const props = [...new Set([...defaultProps, ...(options?.properties ?? [])])];

  return hubspotFetch<HubSpotListResponse<HubSpotContact>>(
    "/crm/v3/objects/contacts",
    {
      limit: String(options?.limit ?? 10),
      properties: props.join(","),
      ...(options?.after ? { after: options.after } : {}),
    }
  );
}

/**
 * 特定のコンタクトを ID で取得する
 */
export async function getContact(
  id: string,
  properties?: string[]
): Promise<HubSpotContact> {
  const defaultProps = ["firstname", "lastname", "email", "phone", "company", "jobtitle"];
  const props = [...new Set([...defaultProps, ...(properties ?? [])])];

  return hubspotFetch<HubSpotContact>(`/crm/v3/objects/contacts/${id}`, {
    properties: props.join(","),
  });
}

// --------------------------------------------------
// 会社
// --------------------------------------------------

/**
 * 会社一覧を取得する
 */
export async function getCompanies(options?: {
  limit?: number;
  after?: string;
  properties?: string[];
}): Promise<HubSpotListResponse<HubSpotCompany>> {
  const defaultProps = ["name", "domain", "industry", "city", "country", "numberofemployees"];
  const props = [...new Set([...defaultProps, ...(options?.properties ?? [])])];

  return hubspotFetch<HubSpotListResponse<HubSpotCompany>>(
    "/crm/v3/objects/companies",
    {
      limit: String(options?.limit ?? 10),
      properties: props.join(","),
      ...(options?.after ? { after: options.after } : {}),
    }
  );
}

/**
 * 特定の会社を ID で取得する
 */
export async function getCompany(
  id: string,
  properties?: string[]
): Promise<HubSpotCompany> {
  const defaultProps = ["name", "domain", "industry", "city", "country", "numberofemployees"];
  const props = [...new Set([...defaultProps, ...(properties ?? [])])];

  return hubspotFetch<HubSpotCompany>(`/crm/v3/objects/companies/${id}`, {
    properties: props.join(","),
  });
}

// --------------------------------------------------
// 取引（ディール）
// --------------------------------------------------

/**
 * 取引一覧を取得する
 */
export async function getDeals(options?: {
  limit?: number;
  after?: string;
  properties?: string[];
}): Promise<HubSpotListResponse<HubSpotDeal>> {
  const defaultProps = ["dealname", "amount", "dealstage", "pipeline", "closedate"];
  const props = [...new Set([...defaultProps, ...(options?.properties ?? [])])];

  return hubspotFetch<HubSpotListResponse<HubSpotDeal>>(
    "/crm/v3/objects/deals",
    {
      limit: String(options?.limit ?? 10),
      properties: props.join(","),
      ...(options?.after ? { after: options.after } : {}),
    }
  );
}

/**
 * 特定の取引を ID で取得する
 */
export async function getDeal(
  id: string,
  properties?: string[]
): Promise<HubSpotDeal> {
  const defaultProps = ["dealname", "amount", "dealstage", "pipeline", "closedate"];
  const props = [...new Set([...defaultProps, ...(properties ?? [])])];

  return hubspotFetch<HubSpotDeal>(`/crm/v3/objects/deals/${id}`, {
    properties: props.join(","),
  });
}

// --------------------------------------------------
// プロパティ定義の取得
// --------------------------------------------------

/**
 * オブジェクトタイプのプロパティ定義を取得する
 * @param objectType "contacts" | "companies" | "deals" など
 */
export async function getProperties(
  objectType: "contacts" | "companies" | "deals"
): Promise<{ results: HubSpotProperty[] }> {
  return hubspotFetch<{ results: HubSpotProperty[] }>(
    `/crm/v3/properties/${objectType}`
  );
}

// --------------------------------------------------
// 全件取得ヘルパー（ページネーション自動処理）
// --------------------------------------------------

/**
 * ページネーションを自動処理して全件取得する汎用ヘルパー
 */
async function fetchAll<T>(
  fetcher: (after?: string) => Promise<HubSpotListResponse<T>>,
  maxRecords = 500
): Promise<T[]> {
  const all: T[] = [];
  let after: string | undefined;

  while (all.length < maxRecords) {
    const res = await fetcher(after);
    all.push(...res.results);
    if (!res.paging?.next) break;
    after = res.paging.next.after;
  }

  return all.slice(0, maxRecords);
}

/** コンタクトを全件取得する（最大 maxRecords 件） */
export const getAllContacts = (
  properties?: string[],
  maxRecords = 500
) =>
  fetchAll<HubSpotContact>(
    (after) => getContacts({ limit: 100, after, properties }),
    maxRecords
  );

/** 会社を全件取得する（最大 maxRecords 件） */
export const getAllCompanies = (
  properties?: string[],
  maxRecords = 500
) =>
  fetchAll<HubSpotCompany>(
    (after) => getCompanies({ limit: 100, after, properties }),
    maxRecords
  );

/** 取引を全件取得する（最大 maxRecords 件） */
export const getAllDeals = (
  properties?: string[],
  maxRecords = 500
) =>
  fetchAll<HubSpotDeal>(
    (after) => getDeals({ limit: 100, after, properties }),
    maxRecords
  );
