import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import { ParsingOptimazer } from "./parsing-optimazer";
import FrontendApi from "../../api/frontend";

export const ParsingOptimazerContainer = () => {
  const [aiRoleBot, setAiRoleBot] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const {
    data: dataGenerateLLM,
    mutate: postGenerateLLM,
    isLoading: postGenerateLLMLoading,
    isError: postGenerateLLMError,
  } = useMutation((_) =>
    aiRoleBot && companyDescription
      ? FrontendApi.generateMessages(aiRoleBot, companyDescription)
      : Promise.resolve(null)
  );

  const handleGenerate = useCallback(() => {
    postGenerateLLM();
  }, [postGenerateLLM]);

  useEffect(() => {
    if (postGenerateLLMError) {
      toast.error("Произошла ошибка генерации сообщений, попробуйте позднее");
    }
  }, [postGenerateLLMError]);


  return (
    <ParsingOptimazer
      generateLoading={postGenerateLLMLoading}
      aiRoleBot={aiRoleBot}
      companyDescription={companyDescription}
      onChangeAiRoleBot={(value: string) => setAiRoleBot(value)}
      onChangeCompanyDescription={(value: string) =>
        setCompanyDescription(value)
      }
      onGenerateClick={handleGenerate}
      dataGenerateLLM={dataGenerateLLM}
    />
  );
};
