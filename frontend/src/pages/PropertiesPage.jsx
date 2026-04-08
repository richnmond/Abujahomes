import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { API_ENDPOINTS } from '../config/api';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    propertyType: searchParams.get('propertyType') || '',
  });

  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setFilters({
      location: searchParams.get('location') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minArea: searchParams.get('minArea') || '',
      maxArea: searchParams.get('maxArea') || '',
      propertyType: searchParams.get('propertyType') || '',
    });
  }, [searchParams]);

  const { data: propertiesData, isLoading, error } = useQuery(
    ['properties', filters.location, filters.minPrice, filters.maxPrice, filters.minArea, filters.maxArea, filters.propertyType, sort, page],
    async () => {
      let url = `${API_ENDPOINTS.PROPERTIES.LIST}?page=${page}&limit=12&sort=${sort}`;
      if (filters.location) url += `&location=${filters.location}`;
      if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
      if (filters.minArea) url += `&minArea=${filters.minArea}`;
      if (filters.maxArea) url += `&maxArea=${filters.maxArea}`;
      if (filters.propertyType) url += `&propertyType=${filters.propertyType}`;

      const response = await axios.get(url);
      return response.data;
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.location) params.set('location', filters.location);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minArea) params.set('minArea', filters.minArea);
    if (filters.maxArea) params.set('maxArea', filters.maxArea);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    params.set('sort', sort);
    params.set('page', '1');

    setSearchParams(params);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Properties</h1>

      {/* Filter Form */}
      <form onSubmit={handleSearch} className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <input
          type="text"
          placeholder="Location (e.g. Abuja)"
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Min Size (sqm)"
          value={filters.minArea}
          onChange={(e) => setFilters((prev) => ({ ...prev, minArea: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Max Size (sqm)"
          value={filters.maxArea}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxArea: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition"
        >
          Search
        </button>
      </form>

      {/* Filters and Sorting */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-gray-600 dark:text-gray-400">
          {propertiesData && `Showing ${propertiesData.properties?.length || 0} of ${propertiesData.total || 0} properties`}
        </div>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && <p className="text-center py-8">Loading properties...</p>}

      {/* Error State */}
      {error && <p className="text-center py-8 text-red-600">Failed to load properties</p>}

      {/* No Results */}
      {!isLoading && propertiesData?.properties?.length === 0 && (
        <p className="text-center py-8 text-gray-600 dark:text-gray-400">No properties found</p>
      )}

      {/* Properties Grid */}
      {!isLoading && propertiesData?.properties && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {propertiesData.properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {propertiesData.pages > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              {Array.from({ length: propertiesData.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-4 py-2 border rounded-lg ${
                    page === p ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(propertiesData.pages, page + 1))}
                disabled={page === propertiesData.pages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
