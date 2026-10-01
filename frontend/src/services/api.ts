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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      throw error;
    }
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
