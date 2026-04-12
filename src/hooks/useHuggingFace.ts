import { useState, useEffect, useRef } from "react";
import type { LLMModel } from "../types/index.ts";
import { fetchHuggingFaceModels } from "../services/huggingface.ts";

export function useHuggingFace(): {
  models: LLMModel[];
  loading: boolean;
  refresh: () => void;
} {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const load = async () => {
    setLoading(true);
    const result = await fetchHuggingFaceModels();
    if (mountedRef.current) {
      setModels(result);
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchHuggingFaceModels().then((result) => {
      if (mountedRef.current) {
        setModels(result);
        setLoading(false);
      }
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { models, loading, refresh: load };
}
