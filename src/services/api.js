export async function fakeApiCall(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data
      });
    }, 500);
  });
}