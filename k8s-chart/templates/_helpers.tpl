{{/*
Expand the name of the chart.
*/}}
{{- define "k8s-chart.name" -}}
{{ .Chart.Name | quote }}
{{- end -}}

{{/*
Create a name that can be used as a fully-qualified name.
*/}}
{{- define "k8s-chart.fullname" -}}
{{- printf "%s-%s" (include "k8s-chart.name" .) .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels.
*/}}
{{- define "k8s-chart.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.Version | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Service Account Name
*/}}
{{- define "k8s-chart.serviceAccountName" -}}
{{- if .Values.serviceAccount.name }}
  {{ .Values.serviceAccount.name }}
{{- else }}
  {{ include "k8s-chart.fullname" . }}
{{- end }}
{{- end -}}
