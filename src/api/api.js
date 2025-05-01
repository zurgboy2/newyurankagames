
export const getProxyTokenCall= async function getProxyToken(scriptId,action) {
    const API_URL = 'https://isa-scavenger-761151e3e681.herokuapp.com/get_token';

    const requestBody = {
      script_id: scriptId,
      action: action,
    };
    console.log(requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    console.log(data);
    if (data.token) return data.token;
    throw new Error('Failed to get token: ' + JSON.stringify(data));
  }


  export const makeRequestCall =async function makeRequest(scriptId,action, formData = {}) {
    const API_URL = 'https://isa-scavenger-761151e3e681.herokuapp.com/proxy';
    try {
      const token = await getProxyTokenCall(scriptId,action);
      const requestBody = {
        token,
        action ,
        script_id: scriptId,
        form_data: formData
      };

      console.log(requestBody);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  export const makeRegistrationRequestCall =async function makeRequest(scriptId,action, formData = {}) {
    const API_URL = 'https://isa-scavenger-761151e3e681.herokuapp.com/proxy';
    try {
      const token = await getProxyTokenCall(scriptId,action);
      const requestBody = {
        token,
        action:action ,
        script_id: scriptId,
        ...formData
      };

      console.log(requestBody);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  export const makeVideoGamesRequestCall =async function makeRequest(scriptId,action) {
    const API_URL = 'https://isa-scavenger-761151e3e681.herokuapp.com/proxy';
    try {
      const token = await getProxyTokenCall("games_script",action);
      const requestBody = {
        token:token,
        action:action ,
        script_id: scriptId
      };

      console.log(requestBody);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      console.log(response);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }