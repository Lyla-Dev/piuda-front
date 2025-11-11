import http from '@/api/http'

/**
 * 핀 데이터를 백엔드에서 가져오는 함수
 * @returns {Promise<Array>} 핀 데이터 배열
 */
export const fetchPins = async () => {
  try {
    const response = await http.get('/pins')
    return response.data
  } catch (error) {
    console.error('핀 데이터 불러오기 실패:', error)
    throw error
  }
}

/**
 * 필터 조건에 맞는 핀 데이터를 가져오는 함수 (향후 확장용)
 * @param {Object} filters - 필터 조건
 * @returns {Promise<Array>} 필터링된 핀 데이터 배열
 */
export const fetchPinsWithFilters = async (filters) => {
  try {
    const response = await http.get('/pins', {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('필터링된 핀 데이터 불러오기 실패:', error)
    throw error
  }
}
