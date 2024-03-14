import getConfig from 'next/config';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {signOut, useSession} from 'next-auth/react';
import {getCtmlStatusLabel} from "../../../libs/types/src/CtmlStatusLabels";
import {getTrialStatusLabel} from "../../../libs/types/src/TrialStatusLabels";
import process from "process";
import {TrialStatusEnum} from "../../../libs/types/src/trial-status.enum";

const useGetMatchResults = () => {
  const {publicRuntimeConfig} = getConfig();
  axios.defaults.baseURL = publicRuntimeConfig.REACT_APP_API_URL || "http://localhost:3333/api"

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {data,status} = useSession()

  useEffect(() => {
    if(status === 'unauthenticated') {
      // router.push('/');
      signOut({redirect: false}).then(() => {
        router.push(process.env.NEXT_PUBLIC_SIGNOUT_REDIRECT_URL as string || '/');
      });
    }
  }, [status])

  const getMatchResultsOperation = async (trials: []) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('ctims-accessToken');
      const headers = {
        'Authorization': 'Bearer ' + accessToken,
      }

      // join each trials.protocol_no with a comma
      const protocol_nos = trials.filter((trial: any) => trial.protocol_no)
        .map((trial: any) => trial.protocol_no)
        .join(',');

      const trialsWithResults = await axios.request({
        method: 'get',
        url: `/trial-result/?protocol_nos=${protocol_nos}`,
        headers
      })

      // Only return trials that are pending or matched
      const filteredTrials = trials.filter((trial: any) =>
        trial.trial_status === TrialStatusEnum.PENDING || trial.trial_status === TrialStatusEnum.MATCHED);
      const mapped = filteredTrials.map((filteredTrial: any) => {
        // lookup the trial with results
        const trialWithResult = trialsWithResults.data.find(trial => trial.nct_id === filteredTrial.nct_id);
        if (trialWithResult) {
          const createdAtDate = new Date(trialWithResult.createdAt);
          const updatedAtDate = new Date(trialWithResult.updatedAt);
          const matchedDateFormatted = trialWithResult.matchedDate ? new Date(trialWithResult.matchedDate).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                }) : null;
          const createdAtFormatted = createdAtDate.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              });
          const updatedAtFormatted = updatedAtDate.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              });
          const ctml_status_label = trialWithResult.ctml_status;
          const trial_status_label = trialWithResult.status;
          const status_label = filteredTrial.trial_status;
          return {
            ...filteredTrial,
            trialStatus: status_label,
            createdAt: createdAtFormatted,
            updatedAt: updatedAtFormatted,
            matchedDate: matchedDateFormatted,
            ctml_status_label,
            trial_status_label
          };
        } else {
          const status_label = filteredTrial.trial_status;
          return {
            ...filteredTrial,
            trialStatus: status_label
          };
        }
      });
      setResponse(mapped);
    } catch (error) {
      setLoading(false)
      if (error.response) {
        setError(error.response.data);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    response,
    error,
    loading,
    getMatchResultsOperation
  }
}
export default useGetMatchResults;
