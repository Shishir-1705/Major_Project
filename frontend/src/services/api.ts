/// <reference types="vite/client" />
import {
  MetadataResponse,
  DatesResponse,
  LayersResponse,
  ModelInfoResponse,
  ZonalStatisticsResponse,
  HotspotStatisticsResponse,
  PersistenceStatisticsResponse,
  GiStarStatisticsResponse,
  LayerType
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const REQUEST_TIMEOUT_MS = 10000; // 10s timeout for geospatial API calls

export class ApiError extends Error {
  public statusCode?: number;
  public isNetworkError: boolean;
  public isTimeout: boolean;
  public userMessage: string;

  constructor(message: string, options: { statusCode?: number; isNetworkError?: boolean; isTimeout?: boolean; userMessage?: string } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options.statusCode;
    this.isNetworkError = options.isNetworkError || false;
    this.isTimeout = options.isTimeout || false;
    this.userMessage = options.userMessage || message;
  }
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(endpoint: string, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timerId);

      if (!response.ok) {
        let userMessage = 'Analysis server request failed.';
        if (response.status === 400) {
          userMessage = 'Invalid parameter in analysis request.';
        } else if (response.status === 404) {
          userMessage = 'Requested spatial layer or date product not found.';
        } else if (response.status === 408 || response.status === 504) {
          userMessage = 'Analysis request timed out. Please try again.';
        } else if (response.status === 429) {
          userMessage = 'Rate limit exceeded. Please wait a moment.';
        } else if (response.status >= 500) {
          userMessage = 'Analysis server encountered an error processing data.';
        }

        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, {
          statusCode: response.status,
          userMessage,
        });
      }

      try {
        return await response.json() as T;
      } catch (jsonErr) {
        throw new ApiError('Failed to parse server response.', {
          userMessage: 'Analysis server returned an invalid response structure.',
        });
      }
    } catch (error: any) {
      clearTimeout(timerId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out', {
          isTimeout: true,
          userMessage: 'Request timed out. Please try again.',
        });
      }

      console.warn(`Network/API error fetching from ${url}:`, error);
      throw new ApiError('Network connection failed', {
        isNetworkError: true,
        userMessage: 'Analysis server is offline or unreachable. Ensure FastAPI backend is running.',
      });
    }
  }

  // 0. Health Check
  async checkHealth(): Promise<{ status: string; service: string }> {
    return this.fetchJson<{ status: string; service: string }>('/health');
  }

  // 1. Core Metadata
  async getMetadata(): Promise<MetadataResponse> {
    return this.fetchJson<MetadataResponse>('/metadata');
  }

  // 2. Observation Dates Inventory
  async getDates(): Promise<DatesResponse> {
    return this.fetchJson<DatesResponse>('/dates');
  }

  // 3. Available Map Layers Metadata
  async getLayers(): Promise<LayersResponse> {
    return this.fetchJson<LayersResponse>('/layers');
  }

  // 4. Locked ML Model Information & Metrics
  async getModelInfo(): Promise<ModelInfoResponse> {
    return this.fetchJson<ModelInfoResponse>('/model');
  }

  // 5. Zonal Statistics
  async getZonalStats(layer: LayerType, date?: string): Promise<ZonalStatisticsResponse> {
    const query = new URLSearchParams();
    query.append('layer', layer);
    if (date) {
      query.append('date', date);
    }
    return this.fetchJson<ZonalStatisticsResponse>(`/statistics/zonal?${query.toString()}`);
  }

  // 6. Hotspot Statistics
  async getHotspotStats(date: string): Promise<HotspotStatisticsResponse> {
    return this.fetchJson<HotspotStatisticsResponse>(`/statistics/hotspot?date=${encodeURIComponent(date)}`);
  }

  // 7. Multi-Temporal Persistence Statistics
  async getPersistenceStats(): Promise<PersistenceStatisticsResponse> {
    return this.fetchJson<PersistenceStatisticsResponse>('/statistics/persistence');
  }

  // 8. Getis-Ord Gi* Spatial Cluster Statistics
  async getGiStarStats(): Promise<GiStarStatisticsResponse> {
    return this.fetchJson<GiStarStatisticsResponse>('/statistics/gi-star');
  }

  // 9. Map Tile URL Constructor
  getTileUrlTemplate(layer: LayerType, dateOrKey: string): string {
    return `${this.baseUrl}/tiles/${layer}/${dateOrKey}/{z}/{x}/{y}.png`;
  }
}

export const api = new ApiService();
